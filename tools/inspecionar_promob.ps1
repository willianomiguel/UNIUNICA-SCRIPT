<#
  Inspeção SOMENTE LEITURA do ambiente Promob/SketchUp nesta máquina Windows.
  Não altera arquivos, registro nem configurações. Não lê conteúdo de projetos
  de clientes: apenas conta arquivos *.promob e mede tamanhos.

  Uso (PowerShell):
    powershell -ExecutionPolicy Bypass -File tools\inspecionar_promob.ps1
  Saída: logs\ambiente_promob.json
#>
$ErrorActionPreference = 'SilentlyContinue'
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'logs'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$pattern = 'Promob|Cyncly|SketchUp|Mooble|Connect'

# 1) Programas instalados (chaves Uninstall 64 e 32 bits + usuário)
$keys = @(
  'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
  'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*',
  'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*'
)
$installed = foreach ($k in $keys) {
  Get-ItemProperty $k | Where-Object { $_.DisplayName -match $pattern -or $_.Publisher -match $pattern } |
    Select-Object DisplayName, DisplayVersion, Publisher, InstallLocation, InstallDate
}

# 2) Pastas candidatas de instalação
$candidates = @("$env:ProgramFiles", "${env:ProgramFiles(x86)}", "$env:LOCALAPPDATA", "$env:APPDATA", "$env:ProgramData", 'C:\') |
  Where-Object { $_ -and (Test-Path $_) }
$dirs = foreach ($c in $candidates) {
  Get-ChildItem -Path $c -Directory -Depth 1 | Where-Object { $_.Name -match $pattern } | Select-Object -ExpandProperty FullName
}
$dirs = $dirs | Sort-Object -Unique

# 3) Executáveis com versão de arquivo e DLLs de plugin/importação
$exes = foreach ($d in $dirs) {
  Get-ChildItem -Path $d -Recurse -Depth 3 -Include *.exe | Select-Object -First 60 |
    ForEach-Object { [pscustomobject]@{ Path = $_.FullName; FileVersion = $_.VersionInfo.FileVersion; Product = $_.VersionInfo.ProductName } }
}
$pluginDlls = foreach ($d in $dirs) {
  Get-ChildItem -Path $d -Recurse -Depth 4 -Include *.dll |
    Where-Object { $_.Name -match 'Plugin|Import|Export|SketchUp|Skp|Obj|3ds|Dxf|Api|Integration|Builder|Catalog|Script' } |
    Select-Object -First 200 | ForEach-Object { [pscustomobject]@{ Path = $_.FullName; FileVersion = $_.VersionInfo.FileVersion } }
}

# 4) Documentação, exemplos e arquivos de configuração (somente nomes)
$docs = foreach ($d in $dirs) {
  Get-ChildItem -Path $d -Recurse -Depth 4 -Include *.pdf, *.chm, *.xsd, *.md, *.txt, *.pcontent, *.pmob, *.skp, *.promob |
    Select-Object -First 200 | ForEach-Object { [pscustomobject]@{ Path = $_.FullName; Size = $_.Length } }
}

# 5) Associações de extensão
$assoc = foreach ($ext in '.promob', '.pmob', '.pcontent', '.skp', '.planner') {
  $prog = (Get-ItemProperty "Registry::HKEY_CLASSES_ROOT\$ext").'(default)'
  $cmd = if ($prog) { (Get-ItemProperty "Registry::HKEY_CLASSES_ROOT\$prog\shell\open\command").'(default)' }
  [pscustomobject]@{ Extension = $ext; ProgId = $prog; OpenCommand = $cmd }
}

# 6) Contagem de projetos (sem abrir nem copiar)
$promobFiles = foreach ($c in "$env:USERPROFILE", 'C:\') {
  Get-ChildItem -Path $c -Recurse -Depth 5 -Filter *.promob | Select-Object -First 500
}
$promobSummary = [pscustomobject]@{
  Count = ($promobFiles | Measure-Object).Count
  Folders = ($promobFiles | ForEach-Object { $_.DirectoryName } | Sort-Object -Unique | Select-Object -First 20)
  SizesKB = ($promobFiles | Select-Object -First 20 | ForEach-Object { [math]::Round($_.Length / 1KB, 1) })
}

# 7) Serviços e processos locais relacionados
$services = Get-Service | Where-Object { $_.DisplayName -match $pattern } | Select-Object Name, DisplayName, Status
$procs = Get-Process | Where-Object { $_.ProcessName -match $pattern } | Select-Object ProcessName, Path

$report = [pscustomobject]@{
  GeneratedAt = (Get-Date).ToString('s')
  Machine = [pscustomobject]@{ OS = (Get-CimInstance Win32_OperatingSystem).Caption; Build = [Environment]::OSVersion.Version.ToString() }
  Installed = $installed
  Directories = $dirs
  Executables = $exes
  PluginDlls = $pluginDlls
  DocsAndSamples = $docs
  FileAssociations = $assoc
  PromobProjects = $promobSummary
  Services = $services
  Processes = $procs
}
$outFile = Join-Path $outDir 'ambiente_promob.json'
$report | ConvertTo-Json -Depth 6 | Out-File -Encoding utf8 $outFile
Write-Host "Relatório salvo em $outFile"
